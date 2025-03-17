package com.apple.shop.store;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;
    private final StoreRepository storeRepository;

    @GetMapping("/store-list")
    public List<StoreDTO> getStoreList(@RequestParam(value = "type", required = false) Integer type) {
        System.out.println("들어옴");
        var storeList = storeRepository.findAllByType(type);
        System.out.println(storeList);

        List<StoreDTO> storeDTOList = new ArrayList<>();

        for (Store store : storeList) {
            StoreDTO temp = new StoreDTO(
                    store.getIdx(),
                    store.getName(),
                    store.getStar(),
                    store.getDeliveryFee(),
                    store.getLogo(),
                    store.getAuth());
            System.out.println(temp);
           storeDTOList.add(temp);
        }

        System.out.println(storeDTOList);

        return storeDTOList;
    }

    @GetMapping("/store-info")
    public StoreDTO getStoreListByStoreIdx(@RequestParam(value = "idx", required = false) Long storeIdx) {
        System.out.println("들어옴");
        var store = storeRepository.findByIdx(storeIdx);
        System.out.println(store);

        StoreDTO result = new StoreDTO(
                store.get().getIdx(),
                store.get().getName(),
                store.get().getLogo(),
                store.get().getAuth(),
                store.get().getAddr(),
                store.get().getNotice(),
                store.get().getTel(),
                store.get().getBno(),
                store.get().getLoc(),
                store.get().getLng(),
                store.get().getInfo(),
                store.get().getStatus(),
                store.get().getRunningTime(),
                store.get().getPauseTime(),
                store.get().getHoliday(),
                store.get().getDeliveryFee(),
                store.get().getStar());

        System.out.println(result);

        return result;
    }
}