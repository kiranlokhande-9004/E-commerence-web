package com.bolt.ecommerce.model;

public class Category {
    private String id;
    private String name;
    private String itemCountText;
    private String iconName;
    private String image;

    public Category() {}

    public Category(String id, String name, String itemCountText, String iconName, String image) {
        this.id = id;
        this.name = name;
        this.itemCountText = itemCountText;
        this.iconName = iconName;
        this.image = image;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getItemCountText() {
        return itemCountText;
    }

    public void setItemCountText(String itemCountText) {
        this.itemCountText = itemCountText;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
