import unittest
from crypto import Crypto


class TestCrypto(unittest.TestCase):
    def test_hashing(self):
        self.assertIsNotNone(Crypto().hash("TEST_PASSWORD"))

    def test_hash_matches(self):
        crypto = Crypto()
        password = "TEST_PASSWORD"

        hashed_password = crypto.hash(password)
        self.assertTrue(crypto.hash_matches(password, hashed_password))


if __name__ == '__main__':
    unittest.main()
