package com.ninja.ninjaccount.repository;

import com.ninja.ninjaccount.domain.Srp;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Srp entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SrpRepository extends JpaRepository<Srp, Long> {

}
