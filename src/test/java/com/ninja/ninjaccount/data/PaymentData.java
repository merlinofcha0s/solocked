package com.ninja.ninjaccount.data;

import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.service.PaymentService;
import com.ninja.ninjaccount.service.dto.PaymentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PaymentData {

    @Autowired
    private PaymentService paymentService;

    public PaymentDTO createRegistrationPaymentForUser(User user, PlanType planType, boolean isPaid, LocalDate validUntil, boolean recurring) {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setPaid(isPaid);
        paymentDTO.setPlanType(planType);
        paymentDTO.setSubscriptionDate(LocalDate.now());
        paymentDTO.setPrice(planType.getPrice());
        paymentDTO.setUserId(user.getId());
        paymentDTO.setUserLogin(user.getLogin());
        paymentDTO.setValidUntil(validUntil);
        paymentDTO.setRecurring(recurring);
        return paymentService.save(paymentDTO);
    }

}
