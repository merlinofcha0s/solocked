package com.ninja.ninjaccount.data;

import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserData {

    @Autowired
    private UserRepository userRepository;

    public User createUserJohnDoe(){
        User userJohn = new User();
        userJohn.setLogin("johndoe");
        userJohn.setPassword(RandomStringUtils.random(60));
        userJohn.setActivated(true);
        userJohn.setEmail("johndoe@localhost");
        userJohn.setFirstName("john");
        userJohn.setLastName("doe");
        userJohn.setImageUrl("http://placehold.it/50x50");
        userJohn.setLangKey("en");
        return userRepository.saveAndFlush(userJohn);
    }
}
