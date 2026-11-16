package me.nilushan.mybus.util;

public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIRECTION = "asc";

    public static final int SEAT_LOCK_DURATION_MINUTES = 10;
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    // Standard Roles
    public static final String ROLE_PASSENGER = "ROLE_PASSENGER";
    public static final String ROLE_STAFF = "ROLE_STAFF";
    public static final String ROLE_OWNER = "ROLE_OWNER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
}
