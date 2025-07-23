package com.study.projectstudy.controller

import jakarta.servlet.http.HttpServletRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.*
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import java.util.Collections
import org.springframework.http.HttpMethod

@RestController
@RequestMapping("/proxy")
class ProxyController(private val restTemplate: RestTemplate) {

    private val backendUrl = "http://admin-backend:8080"

    @RequestMapping("/**")
    fun proxy(request: HttpServletRequest, @RequestBody(required = false) body: String?): ResponseEntity<String> {
        val path = request.requestURI.substring("/proxy".length)
        val url = backendUrl + path + if (request.queryString != null) "?" + request.queryString else ""

        val headers = HttpHeaders()
        Collections.list(request.headerNames).forEach { headerName ->
            if (headerName.equals("host", ignoreCase = true)) return@forEach
            headers.addAll(headerName, Collections.list(request.getHeaders(headerName)))
        }

        val httpMethod = try {
            HttpMethod.valueOf(request.method)
        } catch (ex: IllegalArgumentException) {
            HttpMethod.GET
        }
        val entity = HttpEntity(body, headers)
        val response = restTemplate.exchange(url, httpMethod, entity, String::class.java)

        val responseHeaders = HttpHeaders()
        response.headers.forEach { (key, values) -> responseHeaders.put(key, values) }

        return ResponseEntity(response.body, responseHeaders, response.statusCode)
    }
}

@Configuration
class RestTemplateConfig {
    @Bean
    fun restTemplate(): RestTemplate = RestTemplate()
}
