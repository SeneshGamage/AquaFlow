CREATE TABLE public.fish (
    id bigint NOT NULL,
    active boolean NOT NULL,
    common_name character varying(255) NOT NULL,
    created_at timestamp(6) without time zone,
    description text,
    image_url character varying(255),
    origin_country character varying(255) NOT NULL,
    price_per_unit numeric(10,2) NOT NULL,
    quantity_in_stock integer NOT NULL,
    scientific_name character varying(255),
    updated_at timestamp(6) without time zone
);



CREATE SEQUENCE public.fish_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.fish_id_seq OWNED BY public.fish.id;



CREATE TABLE public.orders (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    notes text,
    quantity integer NOT NULL,
    rejection_reason character varying(255),
    status character varying(255) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    updated_at timestamp(6) without time zone,
    buyer_id bigint NOT NULL,
    fish_id bigint NOT NULL,
    supplier_id bigint,
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PACKED'::character varying, 'SHIPPED'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[])))
);



CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;



CREATE TABLE public.shipments (
    id bigint NOT NULL,
    actual_arrival timestamp(6) without time zone,
    carrier_name character varying(255),
    compliance_document_url character varying(255),
    created_at timestamp(6) without time zone,
    destination_country character varying(255),
    estimated_arrival date,
    health_certificate_url character varying(255),
    notes character varying(255),
    origin_country character varying(255),
    status character varying(255),
    tracking_number character varying(255),
    updated_at timestamp(6) without time zone,
    order_id bigint
);



CREATE SEQUENCE public.shipments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.shipments_id_seq OWNED BY public.shipments.id;



CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'OWNER'::character varying, 'SUPPLIER'::character varying, 'BUYER'::character varying])::text[])))
);



CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;



ALTER TABLE ONLY public.fish ALTER COLUMN id SET DEFAULT nextval('public.fish_id_seq'::regclass);



ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);



ALTER TABLE ONLY public.shipments ALTER COLUMN id SET DEFAULT nextval('public.shipments_id_seq'::regclass);



ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);



ALTER TABLE ONLY public.fish
    ADD CONSTRAINT fish_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);



ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT uk_hrhy2yghr8dampg1jtecuekvp UNIQUE (order_id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk1jdao87w3drivw2vgs2a8jks FOREIGN KEY (supplier_id) REFERENCES public.users(id);



ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk3oe8j64r2qcrgqyf4wiv85xoa FOREIGN KEY (fish_id) REFERENCES public.fish(id);



ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fkhtx3insd5ge6w486omk4fnk54 FOREIGN KEY (buyer_id) REFERENCES public.users(id);



ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT fkrnt4wht95lxxplspltrg9681s FOREIGN KEY (order_id) REFERENCES public.orders(id);


