package com.ninja.ninjaccount.service.social;

import com.ninja.ninjaccount.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.social.twitter.api.Tweet;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.social.twitter.api.impl.TwitterTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Comparator;
import java.util.Optional;

@Service
public class TwitterService {

    private final Logger log = LoggerFactory.getLogger(TwitterService.class);

    private TwitterTemplate twitter;

    public TwitterService(TwitterTemplate twitter) {
        this.twitter = twitter;
    }

    public Optional<Tweet> getLatestTweet() {
        return twitter.timelineOperations()
            .getUserTimeline()
            .stream()
            .max(Comparator.comparing(Tweet::getCreatedAt));
    }
}
