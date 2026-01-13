package com.apple.shop.item;

import com.apple.shop.store.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final ItemRepository itemRepository;
    private final StoreRepository storeRepository;

    /**
     * 기본 상품 목록을 조회합니다. (storeIdx=0)
     */
    @GetMapping("/product-list")
    public List<ItemDTO> getProductsByType() {
        List<Item> items = itemRepository.findAllByStoreIdx(0L);
        return convertToItemDTOList(items);
    }

    /**
     * 특정 매장의 상품 목록을 조회합니다.
     */
    @GetMapping("/shop")
    public List<Item> getItemsByStoreIdx(@RequestParam Long idx) {
        return itemRepository.findAllByStoreIdx(idx);
    }

    /**
     * Item 목록을 ItemDTO 목록으로 변환합니다.
     */
    private List<ItemDTO> convertToItemDTOList(List<Item> items) {
        return items.stream()
                .map(this::convertToItemDTO)
                .collect(Collectors.toList());
    }

    /**
     * Item을 ItemDTO로 변환합니다.
     */
    private ItemDTO convertToItemDTO(Item item) {
        return new ItemDTO(
                item.getName(),
                item.getPrice(),
                item.getImg(),
                item.getInfo(),
                item.getStock(),
                0L);
    }
}
