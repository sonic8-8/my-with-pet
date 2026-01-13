package com.apple.shop.store;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;
    private final StoreRepository storeRepository;

    /**
     * 타입별 매장 목록을 조회합니다.
     */
    @GetMapping("/store-list")
    public List<StoreDTO> getStoreList(@RequestParam(value = "type", required = false) Integer type) {
        List<Store> stores = storeRepository.findAllByType(type);
        return convertToStoreDTOList(stores);
    }

    /**
     * 매장 ID로 매장 상세 정보를 조회합니다.
     */
    @GetMapping("/store-info")
    public StoreDTO getStoreById(@RequestParam(value = "idx", required = false) Long storeIdx) {
        return storeRepository.findByIdx(storeIdx)
                .map(this::convertToDetailStoreDTO)
                .orElse(null);
    }

    /**
     * Store 목록을 StoreDTO 목록으로 변환합니다. (리스트용)
     */
    private List<StoreDTO> convertToStoreDTOList(List<Store> stores) {
        return stores.stream()
                .map(this::convertToListStoreDTO)
                .collect(Collectors.toList());
    }

    /**
     * Store를 리스트용 StoreDTO로 변환합니다.
     */
    private StoreDTO convertToListStoreDTO(Store store) {
        return new StoreDTO(
                store.getIdx(),
                store.getName(),
                store.getStar(),
                store.getDeliveryFee(),
                store.getLogo(),
                store.getAuth());
    }

    /**
     * Store를 상세 정보용 StoreDTO로 변환합니다.
     */
    private StoreDTO convertToDetailStoreDTO(Store store) {
        return new StoreDTO(
                store.getIdx(),
                store.getName(),
                store.getLogo(),
                store.getAuth(),
                store.getAddr(),
                store.getNotice(),
                store.getTel(),
                store.getBno(),
                store.getLoc(),
                store.getLng(),
                store.getInfo(),
                store.getStatus(),
                store.getRunningTime(),
                store.getPauseTime(),
                store.getHoliday(),
                store.getDeliveryFee(),
                store.getStar());
    }
}