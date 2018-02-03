-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    uname character varying(2048) COLLATE pg_catalog."default",
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to awareit;

-- Table: public.user_stuff

-- DROP TABLE public.user_stuff;

CREATE TABLE public.user_stuff
(
    name character varying(1024) COLLATE pg_catalog."default" NOT NULL,
    uid character varying(2048) COLLATE pg_catalog."default" NOT NULL,
    id integer NOT NULL DEFAULT nextval('user_stuff_id_seq'::regclass),
    CONSTRAINT user_stuff_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_stuff
    OWNER to awareit;

-- Table: public.user_action_state

-- DROP TABLE public.user_action_state;

CREATE TABLE public.user_action_state
(
    uid integer NOT NULL,
    last_action character varying(2048) COLLATE pg_catalog."default" NOT NULL,
    data json
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_action_state
    OWNER to awareit;

-- Table: public.reminder

-- DROP TABLE public.reminder;

CREATE TABLE public.reminder
(
    id integer NOT NULL DEFAULT nextval('reminder_id_seq'::regclass),
    stuff_id integer NOT NULL,
    uid integer NOT NULL,
    schedule_time timestamp without time zone NOT NULL,
    CONSTRAINT reminder_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.reminder
    OWNER to awareit;

-- Table: public.history

-- DROP TABLE public.history;

CREATE TABLE public.history
(
    uid integer NOT NULL,
    stuff_id integer NOT NULL,
    stuff_position character varying(2048) COLLATE pg_catalog."default",
    tags text COLLATE pg_catalog."default",
    location point
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.history
    OWNER to awareit;

