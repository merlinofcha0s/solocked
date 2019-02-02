package com.ninja.ninjaccount.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Srp.
 */
@Entity
@Table(name = "srp")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Srp implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "salt", nullable = false)
    private String salt;

    
    @Lob
    @Column(name = "verifier", nullable = false)
    private String verifier;

    @OneToOne(optional = false)    @NotNull

    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSalt() {
        return salt;
    }

    public Srp salt(String salt) {
        this.salt = salt;
        return this;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getVerifier() {
        return verifier;
    }

    public Srp verifier(String verifier) {
        this.verifier = verifier;
        return this;
    }

    public void setVerifier(String verifier) {
        this.verifier = verifier;
    }

    public User getUser() {
        return user;
    }

    public Srp user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Srp srp = (Srp) o;
        if (srp.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), srp.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Srp{" +
            "id=" + getId() +
            ", salt='" + getSalt() + "'" +
            ", verifier='" + getVerifier() + "'" +
            "}";
    }
}
