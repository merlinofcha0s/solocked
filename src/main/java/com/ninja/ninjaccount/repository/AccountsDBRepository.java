package com.ninja.ninjaccount.repository;

import com.ninja.ninjaccount.domain.AccountsDB;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AccountsDB entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountsDBRepository extends JpaRepository<AccountsDB, Long> {

}
