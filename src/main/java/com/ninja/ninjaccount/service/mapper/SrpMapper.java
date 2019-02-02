package com.ninja.ninjaccount.service.mapper;

import com.ninja.ninjaccount.domain.*;
import com.ninja.ninjaccount.service.dto.SrpDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Srp and its DTO SrpDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface SrpMapper extends EntityMapper<SrpDTO, Srp> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.login", target = "userLogin")
    SrpDTO toDto(Srp srp);

    @Mapping(source = "userId", target = "user")
    Srp toEntity(SrpDTO srpDTO);

    default Srp fromId(Long id) {
        if (id == null) {
            return null;
        }
        Srp srp = new Srp();
        srp.setId(id);
        return srp;
    }
}
