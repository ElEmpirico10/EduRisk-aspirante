<?php

class JwtConfig {
    private static $key = 'tk_edurisk-sena-co';
    private static $issuer = 'http://localhost:8080';
    private static $audience = 'http://localhost:8080';
    private static $issueAt = null;
    private static $expirationTime = null;

    public static function getKey() {
        return self::$key;
    }
    public static function getIssuer() {
        return self::$issuer;
    }
    public static function getAudience() {
        return self::$audience;
    }
    public static function getIssueAt() {
        self::$issueAt = time();
        return self::$issueAt;
    }
    public static function expirationTime() {
        self::$expirationTime = self::$issueAt + time();
        return self::$expirationTime;
    }
}