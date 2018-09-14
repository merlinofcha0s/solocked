package com.ninja.ninjaccount.security.srp;

import com.nimbusds.srp6.BigIntegerUtils;
import com.nimbusds.srp6.SRP6CryptoParams;
import com.nimbusds.srp6.SRP6Exception;
import com.nimbusds.srp6.SRP6Routines;
import com.ninja.ninjaccount.service.SrpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;

@Service
public class SRP6ServerSessionV2 {

    public static final BigInteger N = new BigInteger("371949491252987591588430018079860143324639948739964955565041895678949627631777172309351724867251660222667523455600462077533637786075156084976276252563470142928647141583277795643137990945855133898151422013797691184904531144022023133025835015454149700951383595002006509971089667057528575032857085261418581221501533181756904126895371179887057982157526753584412114884915900715272990760544112834697790649635972248141405752319498251193105160079762362062642921403239389964881700689739594340306908799330409244576756422154625145924493248010100526638486918295423167748304826988956303951164388657075460965629589524010360122");
    public static final BigInteger g = SRP6CryptoParams.g_common;
    public static final String k = "8d42a1ff6042ab9daacfd79cf7f60cd11a5dcd39378de417c4d2d63ce829529516d9d1df84aa3544c3863d74a3a0157aa1e7385d2c1c8f37b9eab7abdb32ae34";
    private final Logger log = LoggerFactory.getLogger(SRP6ServerSessionV2.class);
    private final SRP6Routines srp6Routines;
    private final SecureRandom random;
    private CacheManager cacheManager;
    private SrpService srpService;
    private SRP6CryptoParams config;

    public SRP6ServerSessionV2(CacheManager cacheManager, SrpService srpService) {
        this.cacheManager = cacheManager;
        this.srpService = srpService;
        srp6Routines = new SRP6Routines();
        config = new SRP6CryptoParams(N, g, "SHA-512");
        random = new SecureRandom();
    }

    public String step1(String login, BigInteger s, BigInteger v) {
        // Check arguments

        if (login == null || login.trim().isEmpty())
            throw new IllegalArgumentException("The user identity 'I' must not be null or empty");

        if (s == null)
            throw new IllegalArgumentException("The salt 's' must not be null");

        if (v == null)
            throw new IllegalArgumentException("The verifier 'v' must not be null");

        BigInteger b = srp6Routines.generatePrivateValue(config.N, random);

        srpService.setb(b.toString(16), login);

        BigInteger B = SRP6ServerSessionV2.g.modPow(b, SRP6ServerSessionV2.N).add(v.multiply(new BigInteger(k, 16)).mod(SRP6ServerSessionV2.N));
        srpService.setB(B.toString(16), login);

//        log.info("b : " + b.toString(16) + " / " + b.toString());
//        log.info("B : " + B.toString(16) + " / " + B.toString());

        return B.toString(16);
    }

    public BigInteger step2(BigInteger A, BigInteger M1, BigInteger verifier, String login) throws SRP6Exception {
        // Check arguments
        if (A == null)
            throw new IllegalArgumentException("The client public value 'A' must not be null");

        if (M1 == null)
            throw new IllegalArgumentException("The client evidence message 'M1' must not be null");


        String AHex = A.toString(16);
        String BHex = cacheManager.getCache("B").get(login, String.class);
        String bHex = cacheManager.getCache("b").get(login, String.class);

        BigInteger B = new BigInteger(BHex, 16);
        BigInteger b = new BigInteger(bHex, 16);
        MessageDigest digest = config.getMessageDigestInstance();
        // Check A validity
        if (!srp6Routines.isValidPublicValue(config.N, A))
            throw new SRP6Exception("Bad client public value 'A'", SRP6Exception.CauseType.BAD_PUBLIC_VALUE);

        String uHashHex = Sha512DigestUtils.shaHex(AHex + BHex);

        BigInteger u = new BigInteger(uHashHex, 16);

        BigInteger S = srp6Routines.computeSessionKey(config.N, verifier, u, A, b);

        // Compute the own client evidence message 'M1'
//        BigInteger computedM1 = srp6Routines.computeClientEvidence(digest, A, B, S);
        String m1HashHex = Sha512DigestUtils.shaHex((AHex + BHex + S.toString(16)));

        BigInteger computedM1 = new BigInteger(m1HashHex, 16);

        log.info("A (HEX): " + AHex);
        log.info("A: " + A);
        log.info("Client M1: " + M1);
        log.info("Client M1 (HEX): " + M1.toString(16));
        log.info("Server M1: " + computedM1);
        log.info("Server M1 (HEX): " + m1HashHex);
        log.info("V: " + verifier);

        log.info("B (HEX): " + BHex);
        log.info("b (HEX): " + bHex);
        log.info("B: " + B);
        log.info("b: " + b);
        log.info("uhash: " + uHashHex);
        log.info("u: " + u);
        log.info("S: " + S.toString(16));

        // Check for previous mock step 1 then check whether password proof works.
        if (!computedM1.equals(M1)) {
            throw new SRP6Exception("Bad client credentials", SRP6Exception.CauseType.BAD_CREDENTIALS);
        }

        cacheManager.getCache("B").evict(login);
        cacheManager.getCache("b").evict(login);

        // With default routine
        BigInteger M2 = computeServerEvidence(digest, A, M1, S);
        digest.reset();

        return M2;
    }

    private BigInteger computeServerEvidence(final MessageDigest digest,
                                             final BigInteger A,
                                             final BigInteger M1,
                                             final BigInteger S) {

        digest.update(BigIntegerUtils.bigIntegerToBytes(A));
        digest.update(BigIntegerUtils.bigIntegerToBytes(M1));
        digest.update(BigIntegerUtils.bigIntegerToBytes(S));

        return BigIntegerUtils.bigIntegerFromBytes(digest.digest());
    }


}
