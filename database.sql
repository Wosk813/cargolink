--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.4 (Homebrew)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    announcement_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(100) NOT NULL,
    "desc" character varying(256),
    from_latitude double precision NOT NULL,
    to_latitude double precision NOT NULL,
    start_date timestamp without time zone NOT NULL,
    arrive_date timestamp without time zone NOT NULL,
    max_weight integer NOT NULL,
    size_x integer NOT NULL,
    size_y integer NOT NULL,
    max_height integer NOT NULL,
    to_longitude double precision NOT NULL,
    from_longitude double precision NOT NULL,
    author_id uuid NOT NULL,
    is_accepted boolean DEFAULT false NOT NULL,
    vehicle_brand character varying(100),
    vehicle_model character varying(100)
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    chat_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    announcement_id uuid NOT NULL
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    company_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    nip character varying(10) NOT NULL,
    country character varying(100) NOT NULL,
    city character varying(100) NOT NULL,
    street character varying(100) NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: errands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.errands (
    errand_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(100) NOT NULL,
    "desc" character varying(256),
    from_latitude double precision NOT NULL,
    from_longitude double precision NOT NULL,
    to_latitude double precision NOT NULL,
    to_longitude double precision NOT NULL,
    earlies_at timestamp without time zone NOT NULL,
    latest_at timestamp without time zone NOT NULL,
    good_id uuid NOT NULL,
    author_id uuid NOT NULL,
    is_accepted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.errands OWNER TO postgres;

--
-- Name: goods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goods (
    good_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    category_id uuid NOT NULL,
    weight integer NOT NULL,
    size_x integer NOT NULL,
    size_y integer NOT NULL,
    height integer NOT NULL,
    special_conditions character varying(256)
);


ALTER TABLE public.goods OWNER TO postgres;

--
-- Name: goods_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goods_categories (
    category_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.goods_categories OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    chat_id uuid NOT NULL,
    reciver_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content character varying(256) NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: opinions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.opinions (
    opinion_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    stars integer NOT NULL,
    "desc" character varying(256)
);


ALTER TABLE public.opinions OWNER TO postgres;

--
-- Name: opinions_stars_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.opinions ALTER COLUMN stars ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.opinions_stars_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 5
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password character varying(256) NOT NULL,
    account_type character varying NOT NULL,
    city character varying(100),
    country character varying(100),
    street_name character varying(100),
    phone_number character varying(12),
    company_id uuid,
    languages json,
    user_desc character varying(256) DEFAULT NULL::character varying,
    is_phisical_person boolean,
    last_logged timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT users_account_type_check CHECK (((account_type)::text = ANY ((ARRAY['admin'::character varying, 'mod'::character varying, 'carrier'::character varying, 'principal'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.announcements (announcement_id, title, "desc", from_latitude, to_latitude, start_date, arrive_date, max_weight, size_x, size_y, max_height, to_longitude, from_longitude, author_id, is_accepted, vehicle_brand, vehicle_model) FROM stdin;
68cc880b-d25c-4060-ab75-ab670f1feabe	sadas	asdasd	1	2	2024-09-22 16:14:14	2024-09-22 16:14:17	123	12	1	123	2	2	2d8e72dc-aa4e-4c4c-b02b-b08655d891aa	f	\N	\N
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chats (chat_id, announcement_id) FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (company_id, name, nip, country, city, street) FROM stdin;
bc358db6-9379-49d5-a915-2739b292f261	Promatic	1234567890	Poland	Jelenia góra	Ceglana 14
\.


--
-- Data for Name: errands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.errands (errand_id, title, "desc", from_latitude, from_longitude, to_latitude, to_longitude, earlies_at, latest_at, good_id, author_id, is_accepted) FROM stdin;
\.


--
-- Data for Name: goods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goods (good_id, name, category_id, weight, size_x, size_y, height, special_conditions) FROM stdin;
\.


--
-- Data for Name: goods_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goods_categories (category_id, name) FROM stdin;
8f7b29a1-4dbf-4936-9086-f945681bd9c0	Jedzenie
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (chat_id, reciver_id, sender_id, content, sent_at) FROM stdin;
\.


--
-- Data for Name: opinions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.opinions (opinion_id, user_id, stars, "desc") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, first_name, last_name, email, created_at, password, account_type, city, country, street_name, phone_number, company_id, languages, user_desc, is_phisical_person, last_logged) FROM stdin;
2d8e72dc-aa4e-4c4c-b02b-b08655d891aa	Krystian	Tomczyk	264173@studnet.pwr.edu.pl	2024-09-22 09:57:19.064222	$2a$06$M/okyRSZvHY80DUo6rlTi.SNaZCZF5/NisSB5PMZCPeaPwnFZplAy	admin	Wrocław	Poland	Polna 17	+48123123123	\N	["polish","english"]	Dzień dobry	t	2024-09-22 09:57:19.064222
\.


--
-- Name: opinions_stars_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.opinions_stars_seq', 1, false);


--
-- Name: announcements announcements_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pk PRIMARY KEY (announcement_id);


--
-- Name: chats chats_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pk PRIMARY KEY (chat_id);


--
-- Name: companies company_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT company_id PRIMARY KEY (company_id);


--
-- Name: errands errands_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.errands
    ADD CONSTRAINT errands_pk PRIMARY KEY (errand_id);


--
-- Name: goods_categories goods_categories_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_categories
    ADD CONSTRAINT goods_categories_pk PRIMARY KEY (category_id);


--
-- Name: goods goods_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods
    ADD CONSTRAINT goods_pk PRIMARY KEY (good_id);


--
-- Name: opinions opinions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opinions
    ADD CONSTRAINT opinions_pk PRIMARY KEY (opinion_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: announcements announcements_users_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_users_user_id_fk FOREIGN KEY (author_id) REFERENCES public.users(user_id);


--
-- Name: chats chats_announcements_announcement_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_announcements_announcement_id_fk FOREIGN KEY (announcement_id) REFERENCES public.announcements(announcement_id);


--
-- Name: chats chats_errands_errand_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_errands_errand_id_fk FOREIGN KEY (announcement_id) REFERENCES public.errands(errand_id);


--
-- Name: errands errands_goods_good_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.errands
    ADD CONSTRAINT errands_goods_good_id_fk FOREIGN KEY (good_id) REFERENCES public.goods(good_id);


--
-- Name: errands errands_users_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.errands
    ADD CONSTRAINT errands_users_user_id_fk FOREIGN KEY (author_id) REFERENCES public.users(user_id);


--
-- Name: goods goods_goods_categories_category_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods
    ADD CONSTRAINT goods_goods_categories_category_id_fk FOREIGN KEY (category_id) REFERENCES public.goods_categories(category_id);


--
-- Name: messages messages_chats_chat_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_chats_chat_id_fk FOREIGN KEY (chat_id) REFERENCES public.chats(chat_id);


--
-- Name: messages messages_users_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_users_user_id_fk FOREIGN KEY (reciver_id) REFERENCES public.users(user_id);


--
-- Name: messages messages_users_user_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_users_user_id_fk_2 FOREIGN KEY (sender_id) REFERENCES public.users(user_id);


--
-- Name: opinions opinions_users_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opinions
    ADD CONSTRAINT opinions_users_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: users users_companies_company_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_companies_company_id_fk FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- PostgreSQL database dump complete
--

