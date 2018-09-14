package com.ninja.ninjaccount.repository;

import com.ninja.ninjaccount.domain.Srp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


/**
 * Spring Data  repository for the Srp entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SrpRepository extends JpaRepository<Srp, Long> {

    Optional<Srp> findByUserLogin(String login);
}
