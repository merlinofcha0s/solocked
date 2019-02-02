package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.domain.AccountsDB;
import com.ninja.ninjaccount.repository.AccountsDBRepository;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
import com.ninja.ninjaccount.service.mapper.AccountsDBMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public AccountsDBService(AccountsDBRepository accountsDBRepository, AccountsDBMapper accountsDBMapper) {
        this.accountsDBRepository = accountsDBRepository;
        this.accountsDBMapper = accountsDBMapper;
    }

    /**
     * Save a accountsDB.
     *
     * @param accountsDBDTO the entity to save
     * @return the persisted entity
     */
    public AccountsDBDTO save(AccountsDBDTO accountsDBDTO) {
        log.debug("Request to save AccountsDB : {}", accountsDBDTO);
        AccountsDB accountsDB = accountsDBMapper.toEntity(accountsDBDTO);
        accountsDB = accountsDBRepository.save(accountsDB);
        return accountsDBMapper.toDto(accountsDB);
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
    public Optional<AccountsDBDTO> findOne(Long id) {
        log.debug("Request to get AccountsDB : {}", id);
        return accountsDBRepository.findById(id)
            .map(accountsDBMapper::toDto);
    }

    /**
     * Delete the accountsDB by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete AccountsDB : {}", id);
        accountsDBRepository.deleteById(id);
    }
}
