import pandas as pd


def export_to_excel(data, filename="balance.xlsx"):
    df = pd.DataFrame(data)
    with pd.ExcelWriter(filename) as writer:
        df.to_excel(writer, index=False)
