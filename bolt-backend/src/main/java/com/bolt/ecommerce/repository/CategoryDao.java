package com.bolt.ecommerce.repository;

import com.bolt.ecommerce.model.Category;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class CategoryDao {

    private final JdbcTemplate jdbcTemplate;

    public CategoryDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Category> categoryRowMapper = new RowMapper<>() {
        @Override
        public Category mapRow(ResultSet rs, int rowNum) throws SQLException {
            Category c = new Category();
            c.setId(rs.getString("id"));
            c.setName(rs.getString("name"));
            c.setItemCountText(rs.getString("item_count_text"));
            c.setIconName(rs.getString("icon_name"));
            c.setImage(rs.getString("image"));
            return c;
        }
    };

    public List<Category> findAll() {
        String sql = "SELECT * FROM categories ORDER BY id ASC";
        return jdbcTemplate.query(sql, categoryRowMapper);
    }

    public Optional<Category> findById(String id) {
        String sql = "SELECT * FROM categories WHERE id = ?";
        try {
            Category category = jdbcTemplate.queryForObject(sql, categoryRowMapper, id);
            return Optional.ofNullable(category);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
