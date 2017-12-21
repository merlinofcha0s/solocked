package com.ninja.ninjaccount.service.dto;


import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the AccountsDB entity.
 */
public class AccountsDBDTO implements Serializable {

    private Long id;

    private String initializationVector;

    @Lob
    private byte[] database;
    private String databaseContentType;

    @NotNull
    @Min(value = 0)
    private Integer nbAccounts;

    private Long userId;

    private String userLogin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInitializationVector() {
        return initializationVector;
    }

    public void setInitializationVector(String initializationVector) {
        this.initializationVector = initializationVector;
    }

    public byte[] getDatabase() {
        return database;
    }

    public void setDatabase(byte[] database) {
        this.database = database;
    }

    public String getDatabaseContentType() {
        return databaseContentType;
    }

    public void setDatabaseContentType(String databaseContentType) {
        this.databaseContentType = databaseContentType;
    }

    public Integer getNbAccounts() {
        return nbAccounts;
    }

    public void setNbAccounts(Integer nbAccounts) {
        this.nbAccounts = nbAccounts;
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
            ", initializationVector='" + getInitializationVector() + "'" +
            ", database='" + getDatabase() + "'" +
            ", nbAccounts=" + getNbAccounts() +
            "}";
    }
}
