package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.domain.Srp;
import com.ninja.ninjaccount.repository.SrpRepository;
import com.ninja.ninjaccount.service.dto.SrpDTO;
import com.ninja.ninjaccount.service.mapper.SrpMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
/**
 * Service Implementation for managing Srp.
 */
@Service
@Transactional
public class SrpService {

    private final Logger log = LoggerFactory.getLogger(SrpService.class);

    private final SrpRepository srpRepository;

    private final SrpMapper srpMapper;

    public SrpService(SrpRepository srpRepository, SrpMapper srpMapper) {
        this.srpRepository = srpRepository;
        this.srpMapper = srpMapper;
    }

    /**
     * Save a srp.
     *
     * @param srpDTO the entity to save
     * @return the persisted entity
     */
    public SrpDTO save(SrpDTO srpDTO) {
        log.debug("Request to save Srp : {}", srpDTO);
        Srp srp = srpMapper.toEntity(srpDTO);
        srp = srpRepository.save(srp);
        return srpMapper.toDto(srp);
    }

    /**
     * Get all the srps.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<SrpDTO> findAll() {
        log.debug("Request to get all Srps");
        return srpRepository.findAll().stream()
            .map(srpMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one srp by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<SrpDTO> findOne(Long id) {
        log.debug("Request to get Srp : {}", id);
        return srpRepository.findById(id)
            .map(srpMapper::toDto);
    }

    /**
     * Delete the srp by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Srp : {}", id);
        srpRepository.deleteById(id);
    }
}
