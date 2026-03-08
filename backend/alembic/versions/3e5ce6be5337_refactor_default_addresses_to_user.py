"""refactor_default_addresses_to_user

Revision ID: 3e5ce6be5337
Revises: b45e5dbc14b7
Create Date: 2026-03-08 04:30:40.008949

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3e5ce6be5337'
down_revision: Union[str, Sequence[str], None] = 'b45e5dbc14b7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop is_default_* flags from address (batch mode required for SQLite)
    with op.batch_alter_table('address') as batch_op:
        batch_op.drop_column('is_default_shipping')
        batch_op.drop_column('is_default_billing')

    # Add default address FK columns to user
    op.add_column('user', sa.Column('default_ship_address_id', sa.Integer(), nullable=True))
    op.add_column('user', sa.Column('default_bill_address_id', sa.Integer(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove default address FK columns from user
    with op.batch_alter_table('user') as batch_op:
        batch_op.drop_column('default_bill_address_id')
        batch_op.drop_column('default_ship_address_id')

    # Restore is_default_* flags on address (with safe defaults)
    with op.batch_alter_table('address') as batch_op:
        batch_op.add_column(sa.Column('is_default_billing', sa.BOOLEAN(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('is_default_shipping', sa.BOOLEAN(), nullable=False, server_default='0'))
