package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.security.srp.SRP6ServerWorkflow;
import com.ninja.ninjaccount.service.exceptions.SRP6Exception;
import com.ninja.ninjaccount.web.rest.util.SrpUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = NinjaccountApp.class)
@Transactional
public class SrpServiceTest {

    private final Logger log = LoggerFactory.getLogger(SrpServiceTest.class);

    @Autowired
    private SrpService srpService;

    @Autowired
    private SRP6ServerWorkflow serverWorkflow;

    @Autowired
    private SrpUtils srpUtils;

    @Value("${application.srp.N}")
    private BigInteger N;

    @Value("${application.srp.g}")
    private BigInteger g;

    @Value("${application.srp.k}")
    private String kHex;

    @Test
    @Transactional
    public void testComputation() throws SRP6Exception {
        BigInteger k = new BigInteger(kHex, 16);
        log.info("k : " + k.toString(16));

        String username = "raiden";
        String password = "Lolmdr06";
        String salt = "212158454523131";
        //GENERATE STEP1 CLIENT SIDE
        BigInteger x = serverWorkflow.computeX(salt, username, password);
        BigInteger v = serverWorkflow.generateVerifier(salt, username, password);

        log.info("x : " + x.toString(16));
        log.info("v : " + v.toString(16));

        //GENERATE STEP1 Server SIDE
        String BHex = serverWorkflow.step1(username, v);
        BigInteger B = new BigInteger(BHex, 16);

        //GENERATE STEP2 CLIENT SIDE
        BigInteger a = srpUtils.generatePrivateValue();
        BigInteger A = srpUtils.generateA(a);

        log.info("a : " + a);
        log.info("A : " + A.toString(16));

        BigInteger uClient = new BigInteger(Sha512DigestUtils.shaHex(A.toString(16) + BHex), 16);
        log.info("uClientHex : " + uClient.toString(16));

        BigInteger exp = uClient.multiply(x).add(a);
        BigInteger tmp = g.modPow(x, N).multiply(k);
        BigInteger tmp2 = B.subtract(tmp);
        BigInteger premasterClientSecret = tmp2.modPow(exp, N);

        String M1ComputedClientHex = Sha512DigestUtils.shaHex(A.toString(16) + BHex + premasterClientSecret.toString(16));

        BigInteger M1ClientComputed = new BigInteger(M1ComputedClientHex, 16);

        log.info("exp : " + exp);
        log.info("tmp : " + tmp);
        log.info("tmp2 : " + tmp2);
        log.info("SC : " + premasterClientSecret.toString());
        log.info("SC : " + premasterClientSecret.toString(16));
        log.info("M1ComputedClientHex : " + M1ComputedClientHex);
        log.info("M1ClientComputed : " + M1ClientComputed);
        //END GENERATE STEP2 CLIENT SIDE

        //GENERATE STEP 2 SERVER SIDE
        assertThatCode(() -> {
            BigInteger M2 = serverWorkflow.step2(A, M1ClientComputed, v, username);
            assertThat(M2).isNotNull();
        }).doesNotThrowAnyException();
    }

    @Test
    @Transactional
    public void testNativeComputation() {
        BigInteger k = new BigInteger(kHex, 16);
        log.info("k : " + k.toString(16));

        String username = "raiden";
        String password = "Lolmdr06";
        String salt = "212158454523131";

        // GENERATE VERIFIER
        BigInteger x = new BigInteger(Sha512DigestUtils.shaHex(salt + Sha512DigestUtils.shaHex(username + ":" + password)), 16);
        log.info("x : " + x.toString(16));
        BigInteger v = g.modPow(x, N);
        log.info("v : " + v.toString(16));
        // END GENERATE VERIFIER

        //GENERATE STEP2 CLIENT SIDE
        BigInteger a = serverWorkflow.generatePrivateValue();
        log.info("a : " + a);
        BigInteger A = g.modPow(a, N);
        log.info("A : " + A.toString(16));

        //GENERATE STEP1 SERVER SIDE
        BigInteger b = serverWorkflow.generatePrivateValue();
        log.info("b : " + b);

        BigInteger B = g.modPow(b, N).add(v.multiply(k)).mod(N);
        log.info("B (HEX) : " + B.toString(16));
        log.info("B : " + B.toString());
        // END GENERATE STEP1 SERVER SIDE

        BigInteger uClient = new BigInteger(Sha512DigestUtils.shaHex(A.toString(16) + B.toString(16)), 16);
        log.info("uClientHex : " + uClient.toString(16));

        BigInteger exp = uClient.multiply(x).add(a);
        log.info("exp : " + exp);
        BigInteger tmp = g.modPow(x, N).multiply(k);
        log.info("tmp : " + tmp);
        BigInteger tmp2 = B.subtract(tmp);
        log.info("tmp2 : " + tmp2);
        BigInteger premasterClientSecret = tmp2.modPow(exp, N);
        log.info("SC : " + premasterClientSecret.toString());
        log.info("SC : " + premasterClientSecret.toString(16));

        String M1ComputedClientHex = Sha512DigestUtils.shaHex(A.toString(16) + B.toString(16) + premasterClientSecret.toString(16));
        log.info("M1ComputedClientHex : " + M1ComputedClientHex);
        BigInteger M1ClientComputed = new BigInteger(M1ComputedClientHex, 16);
        log.info("M1ClientComputed : " + M1ClientComputed);
        //END GENERATE STEP2 CLIENT SIDE

        //GENERATE STEP 2 SERVER SIDE
        BigInteger premasterServerSecret = serverWorkflow.computeSessionKey(N, v, uClient, A, b);
        log.info("SS : " + premasterServerSecret.toString(16));
        String M1ComputedServerHex = Sha512DigestUtils.shaHex(A.toString(16) + B.toString(16) + premasterServerSecret.toString(16));
        log.info("M1ComputedServerHex : " + M1ComputedServerHex);
        BigInteger M1ServerComputed = new BigInteger(M1ComputedServerHex, 16);
        log.info("M1ServerComputed : " + M1ServerComputed);
        //END GENERATE STEP 2 SERVER SIDE


        if (M1ServerComputed.equals(M1ClientComputed)) {
            log.info("EQUALS");
        }

        //END CLIENT COMPUTATION
    }

}
