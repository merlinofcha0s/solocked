package com.ninja.ninjaccount.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ninja.ninjaccount.security.AuthoritiesConstants;
import com.ninja.ninjaccount.service.SrpService;
import com.ninja.ninjaccount.service.dto.SrpDTO;
import com.ninja.ninjaccount.web.rest.errors.BadRequestAlertException;
import com.ninja.ninjaccount.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Srp.
 */
@RestController
@RequestMapping("/api")
public class SrpResource {

    private static final String ENTITY_NAME = "srp";
    private final Logger log = LoggerFactory.getLogger(SrpResource.class);
    private final SrpService srpService;

    public SrpResource(SrpService srpService) {
        this.srpService = srpService;
    }

    /**
     * POST  /srps : Create a new srp.
     *
     * @param srpDTO the srpDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new srpDTO, or with status 400 (Bad Request) if the srp has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/srps")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<SrpDTO> createSrp(@Valid @RequestBody SrpDTO srpDTO) throws URISyntaxException {
        log.debug("REST request to save Srp : {}", srpDTO);
        if (srpDTO.getId() != null) {
            throw new BadRequestAlertException("A new srp cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SrpDTO result = srpService.save(srpDTO);
        return ResponseEntity.created(new URI("/api/srps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /srps : Updates an existing srp.
     *
     * @param srpDTO the srpDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated srpDTO,
     * or with status 400 (Bad Request) if the srpDTO is not valid,
     * or with status 500 (Internal Server Error) if the srpDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/srps")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<SrpDTO> updateSrp(@Valid @RequestBody SrpDTO srpDTO) throws URISyntaxException {
        log.debug("REST request to update Srp : {}", srpDTO);
        if (srpDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SrpDTO result = srpService.save(srpDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, srpDTO.getId().toString()))
            .body(result);
    }

    @PutMapping("/srps-user")
    @Timed
    public ResponseEntity<Object> updateSrpUser(@Valid @RequestBody SrpDTO srpDTO) throws URISyntaxException {
        Optional<SrpDTO> result = srpService.saveForConnectedUser(srpDTO);

        return result.map(srpUpdated -> ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, srpUpdated.getId().toString()))
            .build()).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * GET  /srps : get all the srps.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of srps in body
     */
    @GetMapping("/srps")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public List<SrpDTO> getAllSrps() {
        log.debug("REST request to get all Srps");
        return srpService.findAll();
    }

    /**
     * GET  /srps/:id : get the "id" srp.
     *
     * @param id the id of the srpDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the srpDTO, or with status 404 (Not Found)
     */
    @GetMapping("/srps/{id}")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<SrpDTO> getSrp(@PathVariable Long id) {
        log.debug("REST request to get Srp : {}", id);
        Optional<SrpDTO> srpDTO = srpService.findOne(id);
        return ResponseUtil.wrapOrNotFound(srpDTO);
    }

    /**
     * DELETE  /srps/:id : delete the "id" srp.
     *
     * @param id the id of the srpDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/srps/{id}")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> deleteSrp(@PathVariable Long id) {
        log.debug("REST request to delete Srp : {}", id);
        srpService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
