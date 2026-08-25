package com.achiles.e_com.config;

import com.achiles.e_com.entity.User;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OAuth2CodeService {

    private final ConcurrentHashMap<String, String> tokenMap = new ConcurrentHashMap<>();

    public String generateCode(String token, User user) {
        String code = UUID.randomUUID().toString();
        tokenMap.put(code, token);
        return code;
    }

    public String exchangeCode(String code) {
        return tokenMap.remove(code); // Returns the token and removes it to prevent reuse
    }
}
