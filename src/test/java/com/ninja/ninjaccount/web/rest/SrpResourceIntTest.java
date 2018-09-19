package com.ninja.ninjaccount.web.rest;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.data.SrpData;
import com.ninja.ninjaccount.data.UserData;
import com.ninja.ninjaccount.domain.Srp;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.SrpRepository;
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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
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
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSrpMockMvc;

    private Srp srp;

    @Autowired
    private UserData userData;

    @Autowired
    private SrpData srpData;

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
    @WithMockUser("johndoe")
    public void updateSrpForConnectedUser() throws Exception {
        // Initialize the database
        User userJohnDoe = userData.createUserJohnDoe();
        Srp oldSrp = srpData.createSrp(DEFAULT_SALT, DEFAULT_VERIFIER, userJohnDoe);

        int databaseSizeBeforeUpdate = srpRepository.findAll().size();

        SrpDTO updatedSrpDTO = new SrpDTO();
        updatedSrpDTO.setVerifier(UPDATED_VERIFIER);
        updatedSrpDTO.setSalt(UPDATED_SALT);

        restSrpMockMvc.perform(put("/api/srps-user")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSrpDTO)))
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
}
