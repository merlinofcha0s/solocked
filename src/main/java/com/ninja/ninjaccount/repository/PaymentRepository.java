package com.ninja.ninjaccount.repository;

import com.ninja.ninjaccount.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the Payment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findOneByUserLogin(String login);

    Integer deletePaymentByUserLogin(String login);

    Optional<Payment> findOneByLastPaymentId(String lastPaymentId);

    Optional<Payment> findOneByTokenRecurringAndUserLogin(String tokenRecurring, String login);

    List<Payment> findAllByRecurringTrue();

}
