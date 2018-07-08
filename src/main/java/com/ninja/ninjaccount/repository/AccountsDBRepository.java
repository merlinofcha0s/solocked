package com.ninja.ninjaccount.repository;

import com.ninja.ninjaccount.domain.AccountsDB;
import com.ninja.ninjaccount.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


/**
 * Spring Data  repository for the AccountsDB entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountsDBRepository extends JpaRepository<AccountsDB, Long> {

    Optional<AccountsDB> findOneByUser(User user);

    Optional<AccountsDB> findOneByUserLogin(String login);

    Integer deleteAccountsDBByUserLogin(String login);
}
