package com.ninja.ninjaccount.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ninja.ninjaccount.service.social.TwitterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.social.twitter.api.Tweet;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

/**
 * REST controller for managing social content
 */
@RestController
@RequestMapping("/api")
public class SocialResource {

    private final Logger log = LoggerFactory.getLogger(SocialResource.class);

    private final TwitterService twitterService;

    public SocialResource(TwitterService twitterService) {
        this.twitterService = twitterService;
    }

    /**
     * GET  /get-latest-tweet : activate the registered user.
     *
     * @param key the activation key
     * @throws RuntimeException 404 (Not Found) no tweets was available
     */
    @GetMapping("/get-latest-tweet")
    @Timed
    public ResponseEntity<Tweet> getLatestTweet() {
        Optional<Tweet> latestTweet = twitterService.getLatestTweet();

        return latestTweet
            .map(tweet -> ResponseEntity.ok().body(tweet))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
