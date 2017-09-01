package com.ninja.ninjaccount.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A AccountsDB.
 */
@Entity
@Table(name = "accountsdb")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class AccountsDB implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "initialization_vector")
    private String initializationVector;

    @Lob
    @Column(name = "jhi_database")
    private byte[] database;

    @Column(name = "jhi_database_content_type")
    private String databaseContentType;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInitializationVector() {
        return initializationVector;
    }

    public AccountsDB initializationVector(String initializationVector) {
        this.initializationVector = initializationVector;
        return this;
    }

    public void setInitializationVector(String initializationVector) {
        this.initializationVector = initializationVector;
    }

    public byte[] getDatabase() {
        return database;
    }

    public AccountsDB database(byte[] database) {
        this.database = database;
        return this;
    }

    public void setDatabase(byte[] database) {
        this.database = database;
    }

    public String getDatabaseContentType() {
        return databaseContentType;
    }

    public AccountsDB databaseContentType(String databaseContentType) {
        this.databaseContentType = databaseContentType;
        return this;
    }

    public void setDatabaseContentType(String databaseContentType) {
        this.databaseContentType = databaseContentType;
    }

    public User getUser() {
        return user;
    }

    public AccountsDB user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - Jhipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AccountsDB accountsDB = (AccountsDB) o;
        if (accountsDB.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), accountsDB.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AccountsDB{" +
            "id=" + getId() +
            ", initializationVector='" + getInitializationVector() + "'" +
            ", database='" + getDatabase() + "'" +
            ", databaseContentType='" + databaseContentType + "'" +
            "}";
    }
}
