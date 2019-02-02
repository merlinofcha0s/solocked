package com.ninja.ninjaccount.web.rest;
import com.ninja.ninjaccount.service.AccountsDBService;
import com.ninja.ninjaccount.web.rest.errors.BadRequestAlertException;
import com.ninja.ninjaccount.web.rest.util.HeaderUtil;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing AccountsDB.
 */
@RestController
@RequestMapping("/api")
public class AccountsDBResource {

    private final Logger log = LoggerFactory.getLogger(AccountsDBResource.class);

    private static final String ENTITY_NAME = "accountsDB";

    private final AccountsDBService accountsDBService;

    public AccountsDBResource(AccountsDBService accountsDBService) {
        this.accountsDBService = accountsDBService;
    }

    /**
     * POST  /accounts-dbs : Create a new accountsDB.
     *
     * @param accountsDBDTO the accountsDBDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new accountsDBDTO, or with status 400 (Bad Request) if the accountsDB has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/accounts-dbs")
    public ResponseEntity<AccountsDBDTO> createAccountsDB(@Valid @RequestBody AccountsDBDTO accountsDBDTO) throws URISyntaxException {
        log.debug("REST request to save AccountsDB : {}", accountsDBDTO);
        if (accountsDBDTO.getId() != null) {
            throw new BadRequestAlertException("A new accountsDB cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AccountsDBDTO result = accountsDBService.save(accountsDBDTO);
        return ResponseEntity.created(new URI("/api/accounts-dbs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /accounts-dbs : Updates an existing accountsDB.
     *
     * @param accountsDBDTO the accountsDBDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated accountsDBDTO,
     * or with status 400 (Bad Request) if the accountsDBDTO is not valid,
     * or with status 500 (Internal Server Error) if the accountsDBDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/accounts-dbs")
    public ResponseEntity<AccountsDBDTO> updateAccountsDB(@Valid @RequestBody AccountsDBDTO accountsDBDTO) throws URISyntaxException {
        log.debug("REST request to update AccountsDB : {}", accountsDBDTO);
        if (accountsDBDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        AccountsDBDTO result = accountsDBService.save(accountsDBDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, accountsDBDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /accounts-dbs : get all the accountsDBS.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of accountsDBS in body
     */
    @GetMapping("/accounts-dbs")
    public List<AccountsDBDTO> getAllAccountsDBS() {
        log.debug("REST request to get all AccountsDBS");
        return accountsDBService.findAll();
    }

    /**
     * GET  /accounts-dbs/:id : get the "id" accountsDB.
     *
     * @param id the id of the accountsDBDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the accountsDBDTO, or with status 404 (Not Found)
     */
    @GetMapping("/accounts-dbs/{id}")
    public ResponseEntity<AccountsDBDTO> getAccountsDB(@PathVariable Long id) {
        log.debug("REST request to get AccountsDB : {}", id);
        Optional<AccountsDBDTO> accountsDBDTO = accountsDBService.findOne(id);
        return ResponseUtil.wrapOrNotFound(accountsDBDTO);
    }

    /**
     * DELETE  /accounts-dbs/:id : delete the "id" accountsDB.
     *
     * @param id the id of the accountsDBDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/accounts-dbs/{id}")
    public ResponseEntity<Void> deleteAccountsDB(@PathVariable Long id) {
        log.debug("REST request to delete AccountsDB : {}", id);
        accountsDBService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
