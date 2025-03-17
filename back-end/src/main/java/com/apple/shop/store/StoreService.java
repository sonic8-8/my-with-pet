package com.apple.shop.store;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreService{

    private final StoreRepository storeRepository;

}
