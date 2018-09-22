package com.ninja.ninjaccount.web.rest;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.data.PaymentData;
import com.ninja.ninjaccount.data.UserData;
import com.ninja.ninjaccount.domain.AccountsDB;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.repository.AccountsDBRepository;
import com.ninja.ninjaccount.repository.UserRepository;
import com.ninja.ninjaccount.security.AuthoritiesConstants;
import com.ninja.ninjaccount.service.AccountsDBService;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
import com.ninja.ninjaccount.service.dto.OperationAccountType;
import com.ninja.ninjaccount.service.mapper.AccountsDBMapper;
import com.ninja.ninjaccount.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import static com.ninja.ninjaccount.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AccountsDBResource REST controller.
 *
 * @see AccountsDBResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = NinjaccountApp.class)
public class AccountsDBResourceIntTest {

    private static final String DEFAULT_INITIALIZATION_VECTOR = "AAAAAAAAAA";
    private static final String UPDATED_INITIALIZATION_VECTOR = "BBBBBBBBBB";

    private static final byte[] DEFAULT_DATABASE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DATABASE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DATABASE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DATABASE_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_NB_ACCOUNTS = 0;
    private static final Integer UPDATED_NB_ACCOUNTS = 1;

    private static final String DEFAULT_SUM = "6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d";
    private String UPDATED_SUM = "";

    @Autowired
    private AccountsDBRepository accountsDBRepository;

    @Autowired
    private AccountsDBMapper accountsDBMapper;



    @Autowired
    private AccountsDBService accountsDBService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private PaymentData paymentData;

    @Autowired
    private UserData userData;

    @Autowired
    private UserRepository userRepository;

    private MockMvc restAccountsDBMockMvc;

    private AccountsDB accountsDB;


    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AccountsDBResource accountsDBResource = new AccountsDBResource(accountsDBService);
        this.restAccountsDBMockMvc = MockMvcBuilders.standaloneSetup(accountsDBResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        UPDATED_SUM = accountsDBService.calculateSum(UPDATED_DATABASE);
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountsDB createEntity(EntityManager em) {
        AccountsDB accountsDB = new AccountsDB()
            .initializationVector(DEFAULT_INITIALIZATION_VECTOR)
            .database(DEFAULT_DATABASE)
            .databaseContentType(DEFAULT_DATABASE_CONTENT_TYPE)
            .nbAccounts(DEFAULT_NB_ACCOUNTS)
            .sum(DEFAULT_SUM);
        return accountsDB;
    }

    @Before
    public void initTest() {
        accountsDB = createEntity(em);
    }

    @Test
    @Transactional
    public void createAccountsDB() throws Exception {
        int databaseSizeBeforeCreate = accountsDBRepository.findAll().size();

        // Create the AccountsDB
        accountsDB.setSum(accountsDBService.calculateSum(accountsDB.getDatabase()));
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(accountsDB);
        accountsDBDTO.setOperationAccountType(OperationAccountType.CREATE);
        restAccountsDBMockMvc.perform(post("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isCreated());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeCreate + 1);
        AccountsDB testAccountsDB = accountsDBList.get(accountsDBList.size() - 1);
        assertThat(testAccountsDB.getInitializationVector()).isEqualTo(DEFAULT_INITIALIZATION_VECTOR);
        assertThat(testAccountsDB.getDatabase()).isEqualTo(DEFAULT_DATABASE);
        assertThat(testAccountsDB.getDatabaseContentType()).isEqualTo(DEFAULT_DATABASE_CONTENT_TYPE);
        assertThat(testAccountsDB.getNbAccounts()).isEqualTo(DEFAULT_NB_ACCOUNTS);
        assertThat(testAccountsDB.getSum()).isEqualTo(accountsDBService.calculateSum(DEFAULT_DATABASE));
    }

    @Test
    @Transactional
    public void createAccountsDBWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = accountsDBRepository.findAll().size();

        // Create the AccountsDB with an existing ID
        accountsDB.setId(1L);
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(accountsDB);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountsDBMockMvc.perform(post("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void createAccountsDBWithWrongSum() throws Exception {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("johndoe", "johndoe", authorities));
        SecurityContextHolder.setContext(securityContext);

        int databaseSizeBeforeCreate = accountsDBRepository.findAll().size();

        // Create the AccountsDB
        accountsDB.setSum(UPDATED_SUM);
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(accountsDB);
        accountsDBDTO.setOperationAccountType(OperationAccountType.CREATE);
        restAccountsDBMockMvc.perform(post("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isExpectationFailed());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNbAccountsIsRequired() throws Exception {
        int databaseSizeBeforeTest = accountsDBRepository.findAll().size();
        // set the field null
        accountsDB.setNbAccounts(null);

        // Create the AccountsDB, which fails.
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(accountsDB);

        restAccountsDBMockMvc.perform(post("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isBadRequest());

        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAccountsDBS() throws Exception {
        // Initialize the database
        accountsDBRepository.saveAndFlush(accountsDB);

        // Get all the accountsDBList
        restAccountsDBMockMvc.perform(get("/api/accounts-dbs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountsDB.getId().intValue())))
            .andExpect(jsonPath("$.[*].initializationVector").value(hasItem(DEFAULT_INITIALIZATION_VECTOR)))
            .andExpect(jsonPath("$.[*].databaseContentType").value(hasItem(DEFAULT_DATABASE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].database").value(hasItem(Base64Utils.encodeToString(DEFAULT_DATABASE))))
            .andExpect(jsonPath("$.[*].nbAccounts").value(hasItem(DEFAULT_NB_ACCOUNTS)))
            .andExpect(jsonPath("$.[*].sum").value(hasItem(DEFAULT_SUM)));
    }

    @Test
    @Transactional
    public void getAccountsDB() throws Exception {
        // Initialize the database
        accountsDBRepository.saveAndFlush(accountsDB);

        // Get the accountsDB
        restAccountsDBMockMvc.perform(get("/api/accounts-dbs/{id}", accountsDB.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(accountsDB.getId().intValue()))
            .andExpect(jsonPath("$.initializationVector").value(DEFAULT_INITIALIZATION_VECTOR))
            .andExpect(jsonPath("$.databaseContentType").value(DEFAULT_DATABASE_CONTENT_TYPE))
            .andExpect(jsonPath("$.database").value(Base64Utils.encodeToString(DEFAULT_DATABASE)))
            .andExpect(jsonPath("$.nbAccounts").value(DEFAULT_NB_ACCOUNTS))
            .andExpect(jsonPath("$.sum").value(DEFAULT_SUM));
    }

    @Test
    @Transactional
    public void getNonExistingAccountsDB() throws Exception {
        // Get the accountsDB
        restAccountsDBMockMvc.perform(get("/api/accounts-dbs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAccountsDB() throws Exception {
        // Initialize the database
        accountsDBRepository.saveAndFlush(accountsDB);

        int databaseSizeBeforeUpdate = accountsDBRepository.findAll().size();

        // Update the accountsDB
        AccountsDB updatedAccountsDB = accountsDBRepository.findById(accountsDB.getId()).get();
        // Disconnect from session so that the updates on updatedAccountsDB are not directly saved in db
        em.detach(updatedAccountsDB);
        updatedAccountsDB
            .initializationVector(UPDATED_INITIALIZATION_VECTOR)
            .database(UPDATED_DATABASE)
            .databaseContentType(UPDATED_DATABASE_CONTENT_TYPE)
            .nbAccounts(UPDATED_NB_ACCOUNTS)
            .sum(accountsDBService.calculateSum(UPDATED_DATABASE));
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(updatedAccountsDB);
        accountsDBDTO.setOperationAccountType(OperationAccountType.CREATE);

        restAccountsDBMockMvc.perform(put("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isOk());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeUpdate);
        AccountsDB testAccountsDB = accountsDBList.get(accountsDBList.size() - 1);
        assertThat(testAccountsDB.getInitializationVector()).isEqualTo(UPDATED_INITIALIZATION_VECTOR);
        assertThat(testAccountsDB.getDatabase()).isEqualTo(UPDATED_DATABASE);
        assertThat(testAccountsDB.getDatabaseContentType()).isEqualTo(UPDATED_DATABASE_CONTENT_TYPE);
        assertThat(testAccountsDB.getNbAccounts()).isEqualTo(UPDATED_NB_ACCOUNTS);
        assertThat(testAccountsDB.getSum()).isEqualTo(UPDATED_SUM);
    }

    @Test
    @Transactional
    public void updateNonExistingAccountsDB() throws Exception {
        int databaseSizeBeforeUpdate = accountsDBRepository.findAll().size();

        // Create the AccountsDB
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(accountsDB);
        accountsDBDTO.setOperationAccountType(OperationAccountType.CREATE);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountsDBMockMvc.perform(put("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAccountsDB() throws Exception {
        // Initialize the database
        accountsDBRepository.saveAndFlush(accountsDB);

        int databaseSizeBeforeDelete = accountsDBRepository.findAll().size();

        // Get the accountsDB
        restAccountsDBMockMvc.perform(delete("/api/accounts-dbs/{id}", accountsDB.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountsDB.class);
        AccountsDB accountsDB1 = new AccountsDB();
        accountsDB1.setId(1L);
        AccountsDB accountsDB2 = new AccountsDB();
        accountsDB2.setId(accountsDB1.getId());
        assertThat(accountsDB1).isEqualTo(accountsDB2);
        accountsDB2.setId(2L);
        assertThat(accountsDB1).isNotEqualTo(accountsDB2);
        accountsDB1.setId(null);
        assertThat(accountsDB1).isNotEqualTo(accountsDB2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountsDBDTO.class);
        AccountsDBDTO accountsDBDTO1 = new AccountsDBDTO();
        accountsDBDTO1.setId(1L);
        AccountsDBDTO accountsDBDTO2 = new AccountsDBDTO();
        assertThat(accountsDBDTO1).isNotEqualTo(accountsDBDTO2);
        accountsDBDTO2.setId(accountsDBDTO1.getId());
        assertThat(accountsDBDTO1).isEqualTo(accountsDBDTO2);
        accountsDBDTO2.setId(2L);
        assertThat(accountsDBDTO1).isNotEqualTo(accountsDBDTO2);
        accountsDBDTO1.setId(null);
        assertThat(accountsDBDTO1).isNotEqualTo(accountsDBDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(accountsDBMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(accountsDBMapper.fromId(null)).isNull();
    }

    @Test
    @Transactional
    @WithMockUser("johndoe")
    public void updateAccountsDBWithoutValidPayment() throws Exception {
        // Initialize the database
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userData.createUserJohnDoe();
        AccountsDBDTO newAccountDB = accountsDBService.createNewAccountDB(bytes, uuid, user);
        paymentData.createRegistrationPaymentForUser(user, PlanType.PREMIUMYEAR, true, LocalDate.now().minus(100, ChronoUnit.DAYS), false);
        int databaseSizeBeforeUpdate = accountsDBRepository.findAll().size();

        // Update the accountsDB
        AccountsDB updatedAccountsDB = accountsDBRepository.getOne(newAccountDB.getId());
        // Disconnect from session so that the updates on updatedAccountsDB are not directly saved in db
        em.detach(updatedAccountsDB);
        updatedAccountsDB
            .initializationVector(UPDATED_INITIALIZATION_VECTOR)
            .database(UPDATED_DATABASE)
            .databaseContentType(UPDATED_DATABASE_CONTENT_TYPE)
            .nbAccounts(UPDATED_NB_ACCOUNTS)
            .sum(accountsDBService.calculateSum(UPDATED_DATABASE));
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(updatedAccountsDB);
        accountsDBDTO.setOperationAccountType(OperationAccountType.CREATE);

        restAccountsDBMockMvc.perform(put("/api/accounts-dbs/updateDbUserConnected")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isExpectationFailed());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeUpdate);
        AccountsDB testAccountsDB = accountsDBList.get(accountsDBList.size() - 1);
        assertThat(testAccountsDB.getInitializationVector()).isEqualTo(uuid);
        assertThat(testAccountsDB.getDatabase()).isEqualTo(bytes);
        assertThat(testAccountsDB.getDatabaseContentType()).isEqualTo(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        assertThat(testAccountsDB.getNbAccounts()).isEqualTo(newAccountDB.getNbAccounts());
        assertThat(testAccountsDB.getSum()).isEqualTo(accountsDBService.calculateSum(bytes));
    }

    @Test
    @Transactional
    @WithMockUser("johndoe")
    public void updateAccountsDBWithValidPayment() throws Exception {
        // Initialize the database
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userData.createUserJohnDoe();
        AccountsDBDTO newAccountDB = accountsDBService.createNewAccountDB(bytes, uuid, user);
        paymentData.createRegistrationPaymentForUser(user, PlanType.PREMIUMYEAR, true, LocalDate.now().plus(100, ChronoUnit.DAYS), false);
        int databaseSizeBeforeUpdate = accountsDBRepository.findAll().size();

        // Update the accountsDB
        AccountsDB updatedAccountsDB = accountsDBRepository.getOne(newAccountDB.getId());
        // Disconnect from session so that the updates on updatedAccountsDB are not directly saved in db
        em.detach(updatedAccountsDB);
        updatedAccountsDB
            .initializationVector(UPDATED_INITIALIZATION_VECTOR)
            .database(UPDATED_DATABASE)
            .databaseContentType(UPDATED_DATABASE_CONTENT_TYPE)
            .nbAccounts(UPDATED_NB_ACCOUNTS)
            .sum(accountsDBService.calculateSum(UPDATED_DATABASE));
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(updatedAccountsDB);
        accountsDBDTO.setOperationAccountType(OperationAccountType.CREATE);

        restAccountsDBMockMvc.perform(put("/api/accounts-dbs/updateDbUserConnected")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isOk());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeUpdate);
        AccountsDB testAccountsDB = accountsDBList.get(accountsDBList.size() - 1);
        assertThat(testAccountsDB.getInitializationVector()).isEqualTo(UPDATED_INITIALIZATION_VECTOR);
        assertThat(testAccountsDB.getDatabase()).isEqualTo(UPDATED_DATABASE);
        assertThat(testAccountsDB.getDatabaseContentType()).isEqualTo(UPDATED_DATABASE_CONTENT_TYPE);
        assertThat(testAccountsDB.getNbAccounts()).isEqualTo(UPDATED_NB_ACCOUNTS);
        assertThat(testAccountsDB.getSum()).isEqualTo(accountsDBService.calculateSum(UPDATED_DATABASE));
    }
}
