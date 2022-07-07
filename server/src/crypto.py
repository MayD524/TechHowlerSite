import bcrypt

NUM_OF_SALT_ROUNDS = 12


class Crypto:
    def hash(self, clear_text):
        encoded = str.encode(clear_text)
        hashed = bcrypt.hashpw(encoded, bcrypt.gensalt(NUM_OF_SALT_ROUNDS))
        return hashed.decode()

    def hash_matches(self, clear_text, hashed_text):
        encoded_text = str.encode(clear_text)
        encoded_hash = str.encode(hashed_text)
        return bcrypt.checkpw(encoded_text, encoded_hash)
