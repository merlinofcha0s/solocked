package com.ninja.ninjaccount.data;

import com.ninja.ninjaccount.domain.Srp;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.SrpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SrpData {

    @Autowired
    private SrpRepository srpRepository;


    public Srp createSrp(String salt, String verifier, User user) {
        Srp srpDTO = new Srp();
        srpDTO.setSalt(salt);
        srpDTO.setVerifier(verifier);
        srpDTO.setUser(user);

        return srpRepository.save(srpDTO);
    }
}
