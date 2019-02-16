package com.ninja.ninjaccount.service.dto;

import javax.persistence.Lob;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Srp entity.
 */
public class SrpDTO implements Serializable {

    private Long id;

    @NotNull
    private String salt;


    @Lob
    private String verifier;


    private Long userId;

    private String userLogin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getVerifier() {
        return verifier;
    }

    public void setVerifier(String verifier) {
        this.verifier = verifier;
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

        SrpDTO srpDTO = (SrpDTO) o;
        if (srpDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), srpDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SrpDTO{" +
            "id=" + getId() +
            ", salt='" + getSalt() + "'" +
            ", verifier='" + getVerifier() + "'" +
            ", user=" + getUserId() +
            ", user='" + getUserLogin() + "'" +
            "}";
    }
}
