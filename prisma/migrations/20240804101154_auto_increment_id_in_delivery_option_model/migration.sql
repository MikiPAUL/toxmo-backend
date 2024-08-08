-- AlterTable
CREATE SEQUENCE deliveryoption_id_seq;
ALTER TABLE "DeliveryOption" ALTER COLUMN "id" SET DEFAULT nextval('deliveryoption_id_seq');
ALTER SEQUENCE deliveryoption_id_seq OWNED BY "DeliveryOption"."id";
