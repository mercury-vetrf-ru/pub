import random
import string

def generate_uuid():
    # Функция для генерации одного 4-символьного блока
    def generate_block():
        # Допустимые символы: 0-9, a-f, A-F
        chars = string.hexdigits
        return ''.join(random.choice(chars) for _ in range(4))
    
    # Генерируем 8 блоков и соединяем их дефисами
    blocks = [generate_block() for _ in range(8)]
    return '-'.join(blocks)

# Генерируем несколько примеров
for _ in range(5):
    print(generate_uuid())