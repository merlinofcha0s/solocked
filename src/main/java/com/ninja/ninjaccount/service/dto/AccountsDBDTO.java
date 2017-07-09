package com.ninja.ninjaccount.service.dto;


import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the AccountsDB entity.
 */
public class AccountsDBDTO implements Serializable {

    private Long id;

    private String database;

    private Long userId;

    private String userLogin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        AccountsDBDTO accountsDBDTO = (AccountsDBDTO) o;
        if(accountsDBDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), accountsDBDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AccountsDBDTO{" +
            "id=" + getId() +
            ", database='" + getDatabase() + "'" +
            "}";
    }
}
