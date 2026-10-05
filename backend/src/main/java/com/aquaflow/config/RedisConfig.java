package com.aquaflow.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableCaching
public class RedisConfig {

  @Autowired private RedisConnectionFactory redisConnectionFactory;

  @Bean
  public RedisTemplate<String, Object> redisTemplate() {
    RedisTemplate<String, Object> template = new RedisTemplate<>();

    StringRedisSerializer stringSerializer = new StringRedisSerializer();
    Jackson2JsonRedisSerializer<Object> jacksonSerializer =
        new Jackson2JsonRedisSerializer<>(Object.class);

    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.activateDefaultTyping(
        LaissezFaireSubTypeValidator.instance,
        ObjectMapper.DefaultTyping.EVERYTHING,
        JsonTypeInfo.As.PROPERTY);
    jacksonSerializer.setObjectMapper(objectMapper);

    template.setConnectionFactory(redisConnectionFactory);
    template.setKeySerializer(stringSerializer);
    template.setValueSerializer(jacksonSerializer);
    template.setHashKeySerializer(stringSerializer);
    template.setHashValueSerializer(jacksonSerializer);
    template.afterPropertiesSet();

    return template;
  }

  @Bean
  public CacheManager cacheManager() {
    StringRedisSerializer keySerializer = new StringRedisSerializer();
    Jackson2JsonRedisSerializer<Object> valueSerializer =
        new Jackson2JsonRedisSerializer<>(Object.class);

    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.activateDefaultTyping(
        LaissezFaireSubTypeValidator.instance,
        ObjectMapper.DefaultTyping.EVERYTHING,
        JsonTypeInfo.As.PROPERTY);
    valueSerializer.setObjectMapper(objectMapper);

    RedisCacheConfiguration config =
        RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .computePrefixWith(cacheName -> cacheName + "::")
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(keySerializer))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(valueSerializer));

    return RedisCacheManager.builder(redisConnectionFactory).cacheDefaults(config).build();
  }
}
