package com.apple.shop.item;

import com.apple.shop.store.Store;
import com.apple.shop.store.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final ItemRepository itemRepository;
    private final StoreRepository storeRepository;


    @GetMapping("/product-list")
    public List<ItemDTO> mainProduct() {

        var temp = itemRepository.findAllByStoreIdx(0L);
        System.out.println(temp);

        List<ItemDTO> itemDTOList = new ArrayList<>();
        System.out.println(itemDTOList);

        for (int i = 0 ; i < temp.size() ; i++) {
            ItemDTO a = new ItemDTO(
                    temp.get(i).getName(),
                    temp.get(i).getPrice(),
                    temp.get(i).getImg(),
                    temp.get(i).getInfo(),
                    temp.get(i).getStock(),
                    0L
                    );
            itemDTOList.add(a);
        }

        System.out.println(itemDTOList);
        for (ItemDTO d : itemDTOList) {
            System.out.println(d);
        }

        System.out.println(itemDTOList);

        return itemDTOList;
    }

    @GetMapping("/shop")
    public List<Item> mainShop(@RequestParam Long idx) {

        List<Item> List = itemRepository.findAllByStoreIdx(idx);

        return List;
    }

}
