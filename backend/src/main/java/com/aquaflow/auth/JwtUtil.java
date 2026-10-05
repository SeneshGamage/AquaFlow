package com.aquaflow.auth;

import com.aquaflow.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtUtil {

  @Value("${app.jwt.secret}")
  private String jwtSecret;

  @Value("${app.jwt.expiration}")
  private long jwtExpirationMs;

  public String generateToken(UserDetails userDetails) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + jwtExpirationMs);

    String role = extractRoleFromUserDetails(userDetails);

    return Jwts.builder()
        .setSubject(userDetails.getUsername())
        .claim("role", role)
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public String extractUsername(String token) {
    try {
      return extractAllClaims(token).getSubject();
    } catch (JwtException ex) {
      log.error("Failed to extract username from token", ex);
      return null;
    }
  }

  public String extractRole(String token) {
    try {
      Object role = extractAllClaims(token).get("role");
      return role == null ? null : String.valueOf(role);
    } catch (JwtException ex) {
      log.error("Failed to extract role from token", ex);
      return null;
    }
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    try {
      String username = extractAllClaims(token).getSubject();
      return username != null
          && username.equals(userDetails.getUsername())
          && !isTokenExpired(token);
    } catch (JwtException ex) {
      log.error("JWT validation error", ex);
      return false;
    }
  }

  public boolean isTokenExpired(String token) {
    try {
      Date expiration = extractAllClaims(token).getExpiration();
      return expiration != null && expiration.before(new Date());
    } catch (JwtException ex) {
      log.error("Failed to check token expiration", ex);
      return true;
    }
  }

  private Claims extractAllClaims(String token) {
    try {
      return Jwts.parserBuilder()
          .setSigningKey(getSigningKey())
          .build()
          .parseClaimsJws(token)
          .getBody();
    } catch (JwtException ex) {
      log.error("JWT parse error", ex);
      throw ex;
    }
  }

  private Key getSigningKey() {
    byte[] keyBytes = decodeSecret(jwtSecret);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  private byte[] decodeSecret(String secret) {
    if (secret == null) {
      return new byte[0];
    }

    String trimmed = secret.trim();
    try {
      return Decoders.BASE64.decode(trimmed);
    } catch (IllegalArgumentException ignored) {
      return trimmed.getBytes(StandardCharsets.UTF_8);
    }
  }

  private String extractRoleFromUserDetails(UserDetails userDetails) {
    if (userDetails instanceof User u && u.getRole() != null) {
      return u.getRole().name();
    }

    return userDetails.getAuthorities().stream()
        .findFirst()
        .map(a -> a.getAuthority())
        .map(a -> a.startsWith("ROLE_") ? a.substring("ROLE_".length()) : a)
        .orElse(null);
  }
}
