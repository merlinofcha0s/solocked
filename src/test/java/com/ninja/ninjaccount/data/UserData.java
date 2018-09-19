package com.ninja.ninjaccount.data;

import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserData {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUserJohnDoe(){
        User userJohn = new User();
        userJohn.setLogin("johndoe");
        userJohn.setPassword(passwordEncoder.encode("test"));
        userJohn.setActivated(true);
        userJohn.setEmail("johndoe@localhost");
        userJohn.setFirstName("john");
        userJohn.setLastName("doe");
        userJohn.setImageUrl("http://placehold.it/50x50");
        userJohn.setLangKey("en");
        return userRepository.saveAndFlush(userJohn);
    }
}
