package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.domain.AccountsDB;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.AccountsDBRepository;
import com.ninja.ninjaccount.security.SecurityUtils;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
import com.ninja.ninjaccount.service.dto.PaymentDTO;
import com.ninja.ninjaccount.service.exceptions.MaxAccountsException;
import com.ninja.ninjaccount.service.mapper.AccountsDBMapper;
import com.ninja.ninjaccount.service.util.PaymentUtil;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.util.Pair;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing AccountsDB.
 */
@Service
@Transactional
public class AccountsDBService {

    private final Logger log = LoggerFactory.getLogger(AccountsDBService.class);

    private final AccountsDBRepository accountsDBRepository;

    private final AccountsDBMapper accountsDBMapper;

    private final PaymentService paymentService;

    public AccountsDBService(AccountsDBRepository accountsDBRepository, AccountsDBMapper accountsDBMapper, PaymentService paymentService) {
        this.accountsDBRepository = accountsDBRepository;
        this.accountsDBMapper = accountsDBMapper;
        this.paymentService = paymentService;
    }

    /**
     * Save a accountsDB.
     *
     * @param accountsDBDTO the entity to save
     * @return the persisted entity
     */
    public AccountsDBDTO save(AccountsDBDTO accountsDBDTO) {
        log.debug("Request to save AccountsDB : {}", accountsDBDTO);
        if (checkDBSum(accountsDBDTO.getDatabase(), accountsDBDTO.getSum())) {
            AccountsDB accountsDB = accountsDBMapper.toEntity(accountsDBDTO);
            accountsDB = accountsDBRepository.save(accountsDB);
            return accountsDBMapper.toDto(accountsDB);
        } else {
            return null;
        }
    }

    public boolean checkDBSum(byte[] accountsdb, String sum) {
        boolean validSum = false;
        ShaPasswordEncoder shaPasswordEncoder = new ShaPasswordEncoder(256);
        byte[] baseByte64 = Base64.encodeBase64(accountsdb);
        String sumSHACheck = shaPasswordEncoder.encodePassword(new String(baseByte64, StandardCharsets.UTF_8), null);
        if (sumSHACheck.equalsIgnoreCase(sum)) {
            validSum = true;
        }

        return validSum;
    }

    /**
     * Get all the accountsDBS.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<AccountsDBDTO> findAll() {
        log.debug("Request to get all AccountsDBS");
        return accountsDBRepository.findAll().stream()
            .map(accountsDBMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one accountsDB by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public AccountsDBDTO findOne(Long id) {
        log.debug("Request to get AccountsDB : {}", id);
        AccountsDB accountsDB = accountsDBRepository.findOne(id);
        return accountsDBMapper.toDto(accountsDB);
    }

    /**
     * Get one accountsDB by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public AccountsDBDTO findByUsernameLogin(String login) {
        log.debug("Request to get AccountsDB by username : {}", login);
        Optional<AccountsDB> accountsDB = accountsDBRepository.findOneByUserLogin(login);
        if (accountsDB.isPresent()) {
            return accountsDBMapper.toDto(accountsDB.get());
        } else {
            return null;
        }
    }

    /**
     * Delete the accountsDB by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete AccountsDB : {}", id);
        accountsDBRepository.delete(id);
    }

    public AccountsDBDTO createNewAccountDB(byte[] encryptedDB, String initVector, User newUser) {
        AccountsDBDTO newAccountsDBDTO = new AccountsDBDTO();
        newAccountsDBDTO.setDatabase(encryptedDB);
        newAccountsDBDTO.setDatabaseContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        newAccountsDBDTO.setInitializationVector(initVector);
        newAccountsDBDTO.setUserId(newUser.getId());
        newAccountsDBDTO.setUserLogin(newUser.getLogin());
        newAccountsDBDTO.setNbAccounts(0);

        return save(newAccountsDBDTO);
    }

    /**
     * Update the accountDB for the connected user
     *
     * @param accountsDBDTO The new accountDB
     * @return the account db updated
     */
    public AccountsDBDTO updateAccountDBForUserConnected(AccountsDBDTO accountsDBDTO) throws MaxAccountsException {
        final String userLogin = SecurityUtils.getCurrentUserLogin().get();
        AccountsDBDTO accountsDBDTOToUpdate = findByUsernameLogin(userLogin);

        accountsDBDTOToUpdate.setDatabase(accountsDBDTO.getDatabase());
        accountsDBDTOToUpdate.setInitializationVector(accountsDBDTO.getInitializationVector());
        accountsDBDTOToUpdate.setDatabaseContentType(accountsDBDTO.getDatabaseContentType());

        Integer nbAccounts = paymentService.checkReachLimitAccounts(userLogin
            , accountsDBDTO.getOperationAccountType(), accountsDBDTOToUpdate.getNbAccounts());

        accountsDBDTOToUpdate.setNbAccounts(nbAccounts);

        save(accountsDBDTOToUpdate);

        return accountsDBDTOToUpdate;
    }

    public Pair<Integer, Integer> getActualAndMaxAccount(String userLogin) {
        AccountsDBDTO accountsDBDTO = findByUsernameLogin(userLogin);
        PaymentDTO paymentDTO = paymentService.findPaymentByLogin(userLogin);
        Integer maxAccount = PaymentUtil.getMaxAccountByPlanType(paymentDTO.getPlanType());

        return Pair.of(accountsDBDTO.getNbAccounts(), maxAccount);
    }
}
