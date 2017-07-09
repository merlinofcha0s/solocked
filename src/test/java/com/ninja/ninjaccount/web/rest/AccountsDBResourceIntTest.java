package com.ninja.ninjaccount.web.rest;

import com.ninja.ninjaccount.NinjaccountApp;

import com.ninja.ninjaccount.domain.AccountsDB;
import com.ninja.ninjaccount.repository.AccountsDBRepository;
import com.ninja.ninjaccount.service.AccountsDBService;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
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
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

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

    private static final String DEFAULT_DATABASE = "AAAAAAAAAA";
    private static final String UPDATED_DATABASE = "BBBBBBBBBB";

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

    private MockMvc restAccountsDBMockMvc;

    private AccountsDB accountsDB;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        AccountsDBResource accountsDBResource = new AccountsDBResource(accountsDBService);
        this.restAccountsDBMockMvc = MockMvcBuilders.standaloneSetup(accountsDBResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountsDB createEntity(EntityManager em) {
        AccountsDB accountsDB = new AccountsDB()
            .database(DEFAULT_DATABASE);
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
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(accountsDB);
        restAccountsDBMockMvc.perform(post("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isCreated());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeCreate + 1);
        AccountsDB testAccountsDB = accountsDBList.get(accountsDBList.size() - 1);
        assertThat(testAccountsDB.getDatabase()).isEqualTo(DEFAULT_DATABASE);
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

        // Validate the Alice in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeCreate);
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
            .andExpect(jsonPath("$.[*].database").value(hasItem(DEFAULT_DATABASE.toString())));
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
            .andExpect(jsonPath("$.database").value(DEFAULT_DATABASE.toString()));
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
        AccountsDB updatedAccountsDB = accountsDBRepository.findOne(accountsDB.getId());
        updatedAccountsDB
            .database(UPDATED_DATABASE);
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(updatedAccountsDB);

        restAccountsDBMockMvc.perform(put("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isOk());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeUpdate);
        AccountsDB testAccountsDB = accountsDBList.get(accountsDBList.size() - 1);
        assertThat(testAccountsDB.getDatabase()).isEqualTo(UPDATED_DATABASE);
    }

    @Test
    @Transactional
    public void updateNonExistingAccountsDB() throws Exception {
        int databaseSizeBeforeUpdate = accountsDBRepository.findAll().size();

        // Create the AccountsDB
        AccountsDBDTO accountsDBDTO = accountsDBMapper.toDto(accountsDB);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAccountsDBMockMvc.perform(put("/api/accounts-dbs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountsDBDTO)))
            .andExpect(status().isCreated());

        // Validate the AccountsDB in the database
        List<AccountsDB> accountsDBList = accountsDBRepository.findAll();
        assertThat(accountsDBList).hasSize(databaseSizeBeforeUpdate + 1);
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
}
