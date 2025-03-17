import React, { useState } from 'react';
import styles from './BizItemEdit.module.css';

function BizItemEdit() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemImageUrl, setNewItemImageUrl] = useState('');
  const logoUrl = 'path/to/your/logo.jpg'; // 가게 로고 URL

  const addCategory = () => {
    if (newCategoryName.trim() !== '') {
      setCategories([...categories, { name: newCategoryName, items: [], newItemName: '', newItemPrice: '', newItemDescription: '', newItemQuantity: '', newItemImageUrl: '' }]);
      setNewCategoryName('');
    }
  };

  const addItem = async (index) => {
    if (categories[index].newItemName.trim() !== '' && categories[index].newItemPrice.trim() !== '') {
      const newItem = {
        name: categories[index].newItemName,
        price: categories[index].newItemPrice,
        description: categories[index].newItemDescription,
        quantity: categories[index].newItemQuantity,
        imageUrl: categories[index].newItemImageUrl,
      };


      const updatedCategories = categories.map((category, idx) => {
        if (idx === index) {
          return {
            ...category,
            items: [
              ...category.items,
              
            ],
            newItemName: '',
            newItemPrice: '',
            newItemDescription: '',
            newItemQuantity: '',
            newItemImageUrl: ''
          };
        }
        return category;
      });
      setCategories(updatedCategories);
    }
  };

  const handleItemChange = (index, key, value) => {
    const updatedCategories = categories.map((category, idx) => {
      if (idx === index) {
        return { ...category, [key]: value };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  return (

    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.storeInfo}>
            <div className={styles.storeLogoContainer}>
              {logoUrl ? (
                <img src={logoUrl} alt="가게 로고" className={styles.storeLogo} />
              ) : (
                <div className={styles.storeLogoPlaceholder}>가게 로고</div>
              )}
            </div>
            <div>
              <h1>가게명1</h1>
              <p>별점<br />배달비 : </p>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.addCategory}>
            <div className={styles.dropdown}>
              <button className={styles.dropbtn}>
                <span className={styles.dropbtn_content}>카테고리</span>
              </button>
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('사료')}>사료</div>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('간식')}>간식</div>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('영양제')}>영양제</div>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('장난감')}>장난감</div>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('도구')}>도구</div>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('훈련사')}>훈련사</div>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('산책대행')}>산책대행</div>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('픽업서비스')}>픽업서비스</div>
                <div className={styles.dropdownItem} onClick={() => setNewCategoryName('미용')}>미용</div>
              </div>
            </div>
            <button onClick={addCategory}>카테고리 추가</button>
          </div>
          <div className={styles.categoryList}>
            {categories.map((category, index) => (
              <div key={index} className={styles.categoryItems}>
                <h2>{category.name}</h2>
                <div className={styles.items}>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.item}>
                      <div className={styles.itemImage}>
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className={styles.itemImagePreview} />}
                      </div>
                      <div className={styles.itemDetails}>
                        <p>이름: {item.name}</p>
                        <p>가격: {item.price}원</p>
                        <p>설명: {item.description}</p>
                        <p>수량: {item.quantity}</p>
                        <button>편집</button>
                        <button>삭제하기</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.addItemForm}>
                  <input
                    type="text"
                    placeholder="아이템 이름"
                    value={category.newItemName}
                    onChange={(e) => handleItemChange(index, 'newItemName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="가격"
                    value={category.newItemPrice}
                    onChange={(e) => handleItemChange(index, 'newItemPrice', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="설명"
                    value={category.newItemDescription}
                    onChange={(e) => handleItemChange(index, 'newItemDescription', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="수량"
                    value={category.newItemQuantity}
                    onChange={(e) => handleItemChange(index, 'newItemQuantity', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="이미지 URL"
                    value={category.newItemImageUrl}
                    onChange={(e) => handleItemChange(index, 'newItemImageUrl', e.target.value)}
                  />
                  <button onClick={() => addItem(index)}>메뉴 추가</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BizItemEdit;
