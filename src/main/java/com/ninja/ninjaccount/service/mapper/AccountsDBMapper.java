package com.ninja.ninjaccount.service.mapper;

import com.ninja.ninjaccount.domain.*;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity AccountsDB and its DTO AccountsDBDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface AccountsDBMapper extends EntityMapper<AccountsDBDTO, AccountsDB> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.login", target = "userLogin")
    AccountsDBDTO toDto(AccountsDB accountsDB); 

    @Mapping(source = "userId", target = "user")
    AccountsDB toEntity(AccountsDBDTO accountsDBDTO);

    default AccountsDB fromId(Long id) {
        if (id == null) {
            return null;
        }
        AccountsDB accountsDB = new AccountsDB();
        accountsDB.setId(id);
        return accountsDB;
    }
}
