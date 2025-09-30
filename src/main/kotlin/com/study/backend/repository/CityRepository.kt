package com.study.backend.repository

import com.study.backend.entity.City
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CityRepository : JpaRepository<City, Long> {
    fun findByNameIgnoreCase(name: String): City?
}
