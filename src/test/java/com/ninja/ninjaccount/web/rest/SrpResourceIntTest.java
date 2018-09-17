package com.ninja.ninjaccount.web.rest;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.domain.Srp;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.SrpRepository;
import com.ninja.ninjaccount.security.srp.SRP6ServerWorkflow;
import com.ninja.ninjaccount.service.SrpService;
import com.ninja.ninjaccount.service.dto.SrpDTO;
import com.ninja.ninjaccount.service.mapper.SrpMapper;
import com.ninja.ninjaccount.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigInteger;
import java.util.List;

import static com.ninja.ninjaccount.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SrpResource REST controller.
 *
 * @see SrpResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = NinjaccountApp.class)
public class SrpResourceIntTest {

    private static final String DEFAULT_SALT = "AAAAAAAAAA";
    private static final String UPDATED_SALT = "BBBBBBBBBB";
    private static final String DEFAULT_VERIFIER = "AAAAAAAAAA";
    private static final String UPDATED_VERIFIER = "BBBBBBBBBB";
    private final Logger log = LoggerFactory.getLogger(SrpResourceIntTest.class);
    @Autowired
    private SrpRepository srpRepository;


    @Autowired
    private SrpMapper srpMapper;


    @Autowired
    private SrpService srpService;

    @Autowired
    private SRP6ServerWorkflow srp6ServerWorkflow;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSrpMockMvc;

    private Srp srp;

    @Value("${application.srp.N}")
    private BigInteger N;

    @Value("${application.srp.g}")
    private BigInteger g;

    @Value("${application.srp.k}")
    private String kHex;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Srp createEntity(EntityManager em) {
        Srp srp = new Srp()
            .salt(DEFAULT_SALT)
            .verifier(DEFAULT_VERIFIER);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        srp.setUser(user);
        return srp;
    }

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SrpResource srpResource = new SrpResource(srpService);
        this.restSrpMockMvc = MockMvcBuilders.standaloneSetup(srpResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        srp = createEntity(em);
    }

    @Test
    @Transactional
    public void createSrp() throws Exception {
        int databaseSizeBeforeCreate = srpRepository.findAll().size();

        // Create the Srp
        SrpDTO srpDTO = srpMapper.toDto(srp);
        restSrpMockMvc.perform(post("/api/srps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(srpDTO)))
            .andExpect(status().isCreated());

        // Validate the Srp in the database
        List<Srp> srpList = srpRepository.findAll();
        assertThat(srpList).hasSize(databaseSizeBeforeCreate + 1);
        Srp testSrp = srpList.get(srpList.size() - 1);
        assertThat(testSrp.getSalt()).isEqualTo(DEFAULT_SALT);
        assertThat(testSrp.getVerifier()).isEqualTo(DEFAULT_VERIFIER);
    }

    @Test
    @Transactional
    public void createSrpWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = srpRepository.findAll().size();

        // Create the Srp with an existing ID
        srp.setId(1L);
        SrpDTO srpDTO = srpMapper.toDto(srp);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSrpMockMvc.perform(post("/api/srps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(srpDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Srp in the database
        List<Srp> srpList = srpRepository.findAll();
        assertThat(srpList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkSaltIsRequired() throws Exception {
        int databaseSizeBeforeTest = srpRepository.findAll().size();
        // set the field null
        srp.setSalt(null);

        // Create the Srp, which fails.
        SrpDTO srpDTO = srpMapper.toDto(srp);

        restSrpMockMvc.perform(post("/api/srps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(srpDTO)))
            .andExpect(status().isBadRequest());

        List<Srp> srpList = srpRepository.findAll();
        assertThat(srpList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSrps() throws Exception {
        // Initialize the database
        srpRepository.saveAndFlush(srp);

        // Get all the srpList
        restSrpMockMvc.perform(get("/api/srps?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(srp.getId().intValue())))
            .andExpect(jsonPath("$.[*].salt").value(hasItem(DEFAULT_SALT.toString())))
            .andExpect(jsonPath("$.[*].verifier").value(hasItem(DEFAULT_VERIFIER.toString())));
    }


    @Test
    @Transactional
    public void getSrp() throws Exception {
        // Initialize the database
        srpRepository.saveAndFlush(srp);

        // Get the srp
        restSrpMockMvc.perform(get("/api/srps/{id}", srp.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(srp.getId().intValue()))
            .andExpect(jsonPath("$.salt").value(DEFAULT_SALT.toString()))
            .andExpect(jsonPath("$.verifier").value(DEFAULT_VERIFIER.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSrp() throws Exception {
        // Get the srp
        restSrpMockMvc.perform(get("/api/srps/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSrp() throws Exception {
        // Initialize the database
        srpRepository.saveAndFlush(srp);

        int databaseSizeBeforeUpdate = srpRepository.findAll().size();

        // Update the srp
        Srp updatedSrp = srpRepository.findById(srp.getId()).get();
        // Disconnect from session so that the updates on updatedSrp are not directly saved in db
        em.detach(updatedSrp);
        updatedSrp
            .salt(UPDATED_SALT)
            .verifier(UPDATED_VERIFIER);
        SrpDTO srpDTO = srpMapper.toDto(updatedSrp);

        restSrpMockMvc.perform(put("/api/srps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(srpDTO)))
            .andExpect(status().isOk());

        // Validate the Srp in the database
        List<Srp> srpList = srpRepository.findAll();
        assertThat(srpList).hasSize(databaseSizeBeforeUpdate);
        Srp testSrp = srpList.get(srpList.size() - 1);
        assertThat(testSrp.getSalt()).isEqualTo(UPDATED_SALT);
        assertThat(testSrp.getVerifier()).isEqualTo(UPDATED_VERIFIER);
    }

    @Test
    @Transactional
    public void updateNonExistingSrp() throws Exception {
        int databaseSizeBeforeUpdate = srpRepository.findAll().size();

        // Create the Srp
        SrpDTO srpDTO = srpMapper.toDto(srp);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException 
        restSrpMockMvc.perform(put("/api/srps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(srpDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Srp in the database
        List<Srp> srpList = srpRepository.findAll();
        assertThat(srpList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSrp() throws Exception {
        // Initialize the database
        srpRepository.saveAndFlush(srp);

        int databaseSizeBeforeDelete = srpRepository.findAll().size();

        // Get the srp
        restSrpMockMvc.perform(delete("/api/srps/{id}", srp.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Srp> srpList = srpRepository.findAll();
        assertThat(srpList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Srp.class);
        Srp srp1 = new Srp();
        srp1.setId(1L);
        Srp srp2 = new Srp();
        srp2.setId(srp1.getId());
        assertThat(srp1).isEqualTo(srp2);
        srp2.setId(2L);
        assertThat(srp1).isNotEqualTo(srp2);
        srp1.setId(null);
        assertThat(srp1).isNotEqualTo(srp2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SrpDTO.class);
        SrpDTO srpDTO1 = new SrpDTO();
        srpDTO1.setId(1L);
        SrpDTO srpDTO2 = new SrpDTO();
        assertThat(srpDTO1).isNotEqualTo(srpDTO2);
        srpDTO2.setId(srpDTO1.getId());
        assertThat(srpDTO1).isEqualTo(srpDTO2);
        srpDTO2.setId(2L);
        assertThat(srpDTO1).isNotEqualTo(srpDTO2);
        srpDTO1.setId(null);
        assertThat(srpDTO1).isNotEqualTo(srpDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(srpMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(srpMapper.fromId(null)).isNull();
    }

    @Test
    @Transactional
    public void testComputation() {
        BigInteger k = new BigInteger(kHex, 16);
        log.info("k : " + k.toString(16));

        String username = "raiden";
        String password = "Lolmdr06";
        String salt = "212158454523131";

        // GENERATE VERIFIER
        BigInteger x = new BigInteger(Sha512DigestUtils.shaHex(salt + Sha512DigestUtils.shaHex(username.toLowerCase() + ":" + password.toLowerCase())), 16);
        log.info("x : " + x.toString(16));
        BigInteger v = g.modPow(x, N);
        log.info("v : " + v.toString(16));
        // END GENERATE VERIFIER


        //GENERATE STEP2 CLIENT SIDE
//        BigInteger a = srp6Routines.generatePrivateValue(SRP6ServerSessionV2.N, new SecureRandom());
        BigInteger a = new BigInteger("4723706393432315314659520415851883571265009157807578292085238845331731373357745428594511043144635152291089278425918170997642115517296679585756521954574153201848656138851066888765168336578393049613211027580130826201838214309869519079490766662530992935006366677693201600099172596838675075974115416696997628019597811444626018460514923190742069666572473711097210734069640607804742963097389894919794597710063036290764146086596798028844113713536734201398786059752363967537706129857899411855142965191489696053234352382318493449610555766020376748125389616298577326062410436378853701697175698089651092579849203526281585856516");
        log.info("a : " + a);
        BigInteger A = g.modPow(a, N);
        log.info("A : " + A.toString(16));

        //GENERATE STEP1 SERVER SIDE
//        BigInteger b = srp6Routines.generatePrivateValue(SRP6ServerSessionV2.N, new SecureRandom());
        BigInteger b = new BigInteger("9806982195738868433391734761522531690090752541755344235033837318186659731436816612887336762808855858604508737906857203734702334260179477583615162669344173892578838542266682607653083491958829435846450426173068276319945548569227443507261704446745519001030292990293368574305483847270477859398855113728499454356921541003871210045484105919031482320188820272225746373119471826642218504436153651317511317447921941936905312089831291729604601117340848194132136995656590445760830085233246353360475254998919431200402688071343530565251725343327686524720020594558862136369720787649758161484332446864365653432035845674160820634107");
        log.info("b : " + b);

        BigInteger B = g.modPow(b, N).add(v.multiply(k)).mod(N);
        log.info("B (HEX) : " + B.toString(16));
        log.info("B : " + B.toString());
        // END GENERATE STEP1 SERVER SIDE

//        BigInteger uClient = srp6Routines.computeU(newMessageDigest(), SRP6ServerSessionV2.N, A, B);
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
        BigInteger premasterServerSecret = srp6ServerWorkflow.computeSessionKey(N, v, uClient, A, b);
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
