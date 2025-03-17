package com.apple.shop.review;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;

    @GetMapping("/review")
    public List<Review> getReviews(@RequestParam Long idx) {

        List<Review> reviewList = reviewRepository.findAllByStoreIdx(idx);
        System.out.println(reviewList);

        return reviewList;
    }
}
